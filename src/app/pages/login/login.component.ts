import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { environment } from "../../../environments/environment";

declare const google: any;

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loading = false;
  error = "";
  clientId = "";
  tempClientId = "";
  logoUrl = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    // Load client_id from environment or localStorage
    if (isPlatformBrowser(this.platformId)) {
      // Priority: environment > localStorage
      this.clientId =
        environment.googleClientId ||
        localStorage.getItem("google_client_id") ||
        "";
      this.logoUrl = localStorage.getItem("app_logo_url") || "";
    }
  }

  ngAfterViewInit(): void {
    if (this.clientId && isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript();
    }
  }

  loadGoogleScript(): void {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn(): void {
    if (typeof google !== "undefined") {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => this.handleCredentialResponse(response),
        auto_select: false,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "filled_blue",
          size: "large",
          width: 350,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        },
      );
    }
  }

  handleCredentialResponse(response: any): void {
    this.loading = true;
    this.error = "";
    this.cdr.detectChanges(); // Force change detection

    try {
      // Decode JWT token
      const payload = this.parseJwt(response.credential);

      // Create user object
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: "MANAGER", // Default role
      };

      // Save to auth service with idToken
      this.authService.loginWithGoogle(response.credential, user).subscribe({
        next: () => {
          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
          this.router.navigate(["/customer-tabs"]);
        },
        error: (err: any) => {
          this.loading = false;
          this.setError("Erro ao autenticar com Google. Tente novamente.");

          console.error("Auth error:", err);
        },
      });
    } catch (err) {
      this.loading = false;
      this.setError(
        "Erro ao processar credenciais do Google. Tente novamente.",
      );
      console.error(err);
    }
  }

  setError(error: string): void {
    this.error = error;
    this.cdr.detectChanges(); // Force change detection

    setTimeout(() => this.reinitializeGoogleButton(), 100);
  }

  reinitializeGoogleButton(): void {
    if (typeof google !== "undefined" && !this.loading) {
      const buttonElement = document.getElementById("google-signin-button");
      if (buttonElement) {
        // Clear the button container
        buttonElement.innerHTML = "";
        // Re-render the button
        google.accounts.id.renderButton(buttonElement, {
          theme: "filled_blue",
          size: "large",
          width: 350,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    }
  }

  parseJwt(token: string): any {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  }

  saveClientId(): void {
    if (this.tempClientId.trim()) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem("google_client_id", this.tempClientId.trim());
        this.clientId = this.tempClientId.trim();
        this.tempClientId = "";

        // Reload to initialize Google Sign-In
        window.location.reload();
      }
    }
  }
}
