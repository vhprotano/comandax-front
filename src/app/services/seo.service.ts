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
    "ComandaX - Comanda Digital para Restaurantes, Bares e Lanchonetes";
  private readonly defaultDescription =
    "Sistema de comanda digital gratuito para restaurantes, bares, lanchonetes e cafeterias. Gerencie pedidos, mesas, cardápio e relatórios de vendas.";
  private readonly defaultImage = `${this.baseUrl}/assets/logo/branco.png`;

  private routeMeta: RouteMetaConfig = {
    "/": {
      title:
        "ComandaX - Comanda Digital para Restaurantes, Bares e Lanchonetes | Sistema Grátis",
      description:
        "Sistema de comanda digital gratuito para restaurantes, bares, lanchonetes e cafeterias. Gerencie pedidos, mesas, cardápio digital e relatórios de vendas. Comece grátis hoje!",
      keywords:
        "comanda digital, comanda eletrônica, sistema para restaurante, sistema de comandas, sistema para bar, sistema para lanchonete, cardápio digital, gestão de restaurante, controle de mesas, pedidos digitais, software restaurante, sistema food service, comanda digital grátis, PDV restaurante",
      type: "website",
    },
    "/login": {
      title: "Entrar | ComandaX - Sistema de Comanda Digital",
      description:
        "Acesse sua conta ComandaX e gerencie seu restaurante, bar ou lanchonete. Sistema completo de comandas digitais, controle de mesas e relatórios.",
      keywords:
        "login comandax, acessar sistema comandas, entrar comanda digital",
      noIndex: true,
    },
    "/customer-tabs": {
      title: "Comandas | ComandaX - Gestão de Pedidos em Tempo Real",
      description:
        "Gerencie todas as comandas digitais do seu estabelecimento em tempo real. Controle pedidos, valores e status das mesas.",
      keywords:
        "comandas abertas, gestão pedidos, controle comandas restaurante, comanda digital",
      noIndex: true,
    },
    "/customer-tabs/nova": {
      title: "Nova Comanda | ComandaX - Abrir Pedido",
      description:
        "Abra uma nova comanda digital para seu cliente. Adicione pedidos de forma rápida e fácil.",
      keywords:
        "abrir comanda, nova comanda digital, criar pedido restaurante",
      noIndex: true,
    },
    "/produtos": {
      title: "Produtos | ComandaX - Cardápio Digital",
      description:
        "Gerencie os produtos do seu cardápio digital. Adicione, edite preços e organize categorias.",
      keywords:
        "cardápio digital, gestão produtos, preços restaurante, menu digital",
      noIndex: true,
    },
    "/categorias": {
      title: "Categorias | ComandaX - Organização do Cardápio",
      description:
        "Organize seu cardápio digital por categorias. Bebidas, pratos, sobremesas e muito mais.",
      keywords:
        "categorias cardápio, organizar menu, tipos produtos restaurante",
      noIndex: true,
    },
    "/mesas": {
      title: "Mesas | ComandaX - Controle de Ocupação em Tempo Real",
      description:
        "Controle a ocupação das mesas do seu estabelecimento. Visualize status em tempo real.",
      keywords:
        "controle mesas, ocupação restaurante, gestão salão, mesas livres ocupadas",
      noIndex: true,
    },
    "/estatisticas": {
      title: "Estatísticas | ComandaX - Relatórios de Vendas",
      description:
        "Acompanhe o desempenho do seu negócio com relatórios de vendas detalhados. Produtos mais pedidos, faturamento e mais.",
      keywords:
        "relatórios restaurante, estatísticas vendas, análise pedidos, dashboard vendas",
      noIndex: true,
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
