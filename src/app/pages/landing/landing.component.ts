import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SeoService } from "../../services/seo.service";
import { LazyLoadDirective } from "../../directives/lazy-load.directive";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadDirective],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  features = [
    {
      icon: "smartphone",
      title: "Pedidos Digitais",
      description:
        "Comandas totalmente digitais eliminam erros de anotação e agilizam o atendimento.",
    },
    {
      icon: "users",
      title: "Controle de Mesas",
      description:
        "Gerencie a ocupação das mesas em tempo real e otimize o fluxo do restaurante.",
    },
    {
      icon: "bar-chart-3",
      title: "Relatórios Detalhados",
      description:
        "Acompanhe vendas, produtos mais pedidos e desempenho do seu negócio.",
    },
    {
      icon: "printer",
      title: "Integração com Impressoras",
      description: "Imprima comandas automaticamente na cozinha e no caixa.",
    },
    {
      icon: "shield",
      title: "Controle de Acesso",
      description:
        "Permissões personalizadas para gerentes, garçons e cozinha.",
    },
    {
      icon: "cloud",
      title: "Acesso de Qualquer Lugar",
      description:
        "Sistema web responsivo funciona em computadores, tablets e smartphones.",
    },
  ];

  testimonials = [
    {
      name: "Carlos Silva",
      business: "Restaurante Dona Maria",
      location: "São Paulo, SP",
      text: "O ComandaX revolucionou nosso atendimento. Reduzimos erros em 80% e aumentamos nossas vendas.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      business: "Lanchonete Express",
      location: "Rio de Janeiro, RJ",
      text: "Sistema intuitivo e fácil de usar. Meus funcionários aprenderam em minutos.",
      rating: 5,
    },
    {
      name: "Roberto Santos",
      business: "Bar do Zé",
      location: "Belo Horizonte, MG",
      text: "Controle total sobre mesas e pedidos. Recomendo para todos os estabelecimentos.",
      rating: 5,
    },
  ];

  pricingPlans = [
    {
      name: "Básico",
      price: "Grátis",
      period: "para sempre",
      features: [
        "Até 50 pedidos/mês",
        "2 usuários",
        "Relatórios básicos",
        "Suporte por email",
      ],
      popular: false,
    },
    {
      name: "Profissional",
      price: "R$ 49",
      period: "/mês",
      features: [
        "Pedidos ilimitados",
        "Usuários ilimitados",
        "Relatórios avançados",
        "Integração com impressoras",
        "Suporte prioritário",
      ],
      popular: true,
    },
    {
      name: "Empresarial",
      price: "R$ 99",
      period: "/mês",
      features: [
        "Tudo do Profissional",
        "Múltiplas unidades",
        "API personalizada",
        "Suporte 24/7",
        "Consultoria especializada",
      ],
      popular: false,
    },
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title:
        "ComandaX - Sistema de Comandas Digital para Restaurantes | Gestão Completa de Pedidos",
      description:
        "ComandaX é o sistema de comandas digital mais completo do Brasil. Gerencie pedidos, mesas, produtos e funcionários do seu restaurante, bar, lanchonete ou café. Aumente suas vendas e reduza erros com pedidos digitais. Comece grátis hoje!",
      keywords:
        "sistema de comandas, gestão de restaurante, pedidos digitais, comanda eletrônica, sistema para bar, sistema para lanchonete, gestão de mesas, cardápio digital, controle de pedidos, software restaurante, PDV restaurante, sistema food service, comanda digital, gerenciamento restaurante Brasil, sistema comandas online, aplicativo restaurante, gestão pedidos online",
      type: "website",
    });
  }

  getIconPath(icon: string): string {
    const icons: Record<string, string> = {
      smartphone:
        "M12 18h-2a1 1 0 01-1-1v-1H9a1 1 0 010-2h2a1 1 0 011 1v1h1a1 1 0 010 2zM8 4V2a1 1 0 011-1h6a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3zm2 0h4V3h-4v1z",
      users: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      "bar-chart-3":
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      printer:
        "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
      shield:
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      cloud:
        "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    };
    return icons[icon] || "";
  }

  scrollToAnchor(anchorId: string){
    const element = document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
