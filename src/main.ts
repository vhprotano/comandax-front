import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";
import { inject } from "@angular/core";
import { environment } from "./environments/environment";
import { authInterceptor } from "./app/interceptors/auth.interceptor";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink).create({
        uri: environment.apiUrl,
      });

      return {
        link: httpLink,
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "network-only",
            errorPolicy: "all",
          },
          query: {
            fetchPolicy: "network-only",
            errorPolicy: "all",
          },
          mutate: {
            errorPolicy: "all",
          },
        },
      };
    }),
  ],
})
  .then(() => {
    // Register service worker for caching and offline functionality
    if (
      isPlatformBrowser(inject(PLATFORM_ID)) &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[Service Worker] Registered successfully:",
            registration.scope
          );

          // Handle service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available
                  console.log("[Service Worker] New version available");
                  // You could show a notification to the user here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[Service Worker] Registration failed:", error);
        });
    }
  })
  .catch((err) => console.error(err));
