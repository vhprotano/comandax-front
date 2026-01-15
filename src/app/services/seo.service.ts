import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

type RouteMetaConfig = Record<string, SeoConfig>;

@Injectable({
  providedIn: "root",
})
export class SeoService {
  private readonly baseUrl = "https://comandax.com.br";
  private readonly defaultTitle =
    "ComandaX - Sistema de Comandas Digital para Restaurantes";
  private readonly defaultDescription =
    "ComandaX é o sistema de comandas digital mais completo do Brasil. Gerencie pedidos, mesas, produtos e funcionários do seu restaurante, bar, lanchonete ou café.";
  private readonly defaultImage = `${this.baseUrl}/assets/logo/branco.png`;

  private routeMeta: RouteMetaConfig = {
    "/": {
      title:
        "ComandaX - Sistema de Comandas Digital para Restaurantes | Gestão Completa de Pedidos",
      description:
        "ComandaX é o sistema de comandas digital mais completo do Brasil. Gerencie pedidos, mesas, produtos e funcionários do seu restaurante, bar, lanchonete ou café. Aumente suas vendas e reduza erros com pedidos digitais. Comece grátis hoje!",
      keywords:
        "sistema de comandas, gestão de restaurante, pedidos digitais, comanda eletrônica, sistema para bar, sistema para lanchonete, gestão de mesas, cardápio digital, controle de pedidos, software restaurante, PDV restaurante, sistema food service, comanda digital, gerenciamento restaurante Brasil, sistema comandas online, aplicativo restaurante, gestão pedidos online",
      type: "website",
    },
    "/login": {
      title: "Login | ComandaX - Sistema de Comandas Digital",
      description:
        "Acesse sua conta ComandaX e gerencie seu restaurante, bar ou lanchonete. Sistema completo de comandas digitais.",
      keywords:
        "login comandax, acessar sistema comandas, entrar restaurante digital",
    },
    "/customer-tabs": {
      title: "Comandas | ComandaX - Gestão de Pedidos",
      description:
        "Gerencie todas as comandas do seu estabelecimento em tempo real. Controle pedidos, valores e status.",
      keywords:
        "comandas abertas, gestão pedidos, controle comandas restaurante",
    },
    "/customer-tabs/nova": {
      title: "Nova Comanda | ComandaX",
      description:
        "Abra uma nova comanda para seu cliente. Adicione pedidos de forma rápida e fácil.",
      keywords: "abrir comanda, nova comanda, criar pedido restaurante",
    },
    "/produtos": {
      title: "Produtos | ComandaX - Cardápio Digital",
      description:
        "Gerencie os produtos do seu cardápio. Adicione, edite preços e organize categorias.",
      keywords:
        "cardápio digital, gestão produtos, preços restaurante, menu digital",
    },
    "/categorias": {
      title: "Categorias | ComandaX - Organização do Cardápio",
      description:
        "Organize seu cardápio por categorias. Bebidas, pratos, sobremesas e muito mais.",
      keywords:
        "categorias cardápio, organizar menu, tipos produtos restaurante",
    },
    "/mesas": {
      title: "Mesas | ComandaX - Controle de Ocupação",
      description:
        "Controle a ocupação das mesas do seu estabelecimento. Veja status em tempo real.",
      keywords:
        "controle mesas, ocupação restaurante, gestão salão, mesas livres",
    },
    "/estatisticas": {
      title: "Estatísticas | ComandaX - Relatórios e Análises",
      description:
        "Acompanhe o desempenho do seu negócio. Vendas, produtos mais pedidos e relatórios.",
      keywords:
        "relatórios restaurante, estatísticas vendas, análise pedidos, dashboard",
    },
  };

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initRouteListener();
  }

  private initRouteListener(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const config = this.routeMeta[event.urlAfterRedirects] || {};
        this.updateMetaTags(config);
      });
  }

  updateMetaTags(config: SeoConfig): void {
    const title = config.title || this.defaultTitle;
    const description = config.description || this.defaultDescription;
    const image = config.image || this.defaultImage;
    const url = config.url || `${this.baseUrl}${this.router.url}`;
    const type = config.type || "website";

    // Update title
    this.titleService.setTitle(title);

    // Update meta tags
    this.meta.updateTag({ name: "title", content: title });
    this.meta.updateTag({ name: "description", content: description });

    if (config.keywords) {
      this.meta.updateTag({ name: "keywords", content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ property: "og:description", content: description });
    this.meta.updateTag({ property: "og:image", content: image });
    this.meta.updateTag({ property: "og:url", content: url });
    this.meta.updateTag({ property: "og:type", content: type });

    // Twitter Card
    this.meta.updateTag({ name: "twitter:title", content: title });
    this.meta.updateTag({ name: "twitter:description", content: description });
    this.meta.updateTag({ name: "twitter:image", content: image });
    this.meta.updateTag({ name: "twitter:url", content: url });

    // Robots
    if (config.noIndex) {
      this.meta.updateTag({ name: "robots", content: "noindex, nofollow" });
    } else {
      this.meta.updateTag({ name: "robots", content: "index, follow" });
    }

    // Update canonical URL
    this.updateCanonicalUrl(url);
  }

  private updateCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = this.document.querySelector(
        'link[rel="canonical"]'
      );
      if (!link) {
        link = this.document.createElement("link");
        link.setAttribute("rel", "canonical");
        this.document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    }
  }

  setNoIndex(): void {
    this.meta.updateTag({ name: "robots", content: "noindex, nofollow" });
  }

  setIndex(): void {
    this.meta.updateTag({ name: "robots", content: "index, follow" });
  }
}
