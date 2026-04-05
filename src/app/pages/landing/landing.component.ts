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
  currentYear = new Date().getFullYear();

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

  faqItems = [
    {
      question: "O que é uma comanda digital?",
      answer:
        "A comanda digital é um sistema eletrônico que substitui as comandas de papel em restaurantes, bares e lanchonetes. Com o ComandaX, os garçons registram pedidos diretamente pelo celular ou tablet, eliminando erros de anotação e agilizando o atendimento. Os pedidos são enviados automaticamente para a cozinha.",
    },
    {
      question: "O ComandaX é realmente gratuito?",
      answer:
        "Sim! O ComandaX oferece um plano gratuito completo para você começar a digitalizar seu restaurante sem nenhum custo. Não é necessário cartão de crédito. Você pode usar todas as funcionalidades básicas como comandas digitais, controle de mesas e cadastro de produtos sem pagar nada.",
    },
    {
      question: "Preciso instalar algum programa no computador?",
      answer:
        "Não. O ComandaX é um sistema 100% na nuvem (web). Basta acessar pelo navegador em qualquer dispositivo: computador, tablet ou smartphone. Não precisa instalar nada e funciona em qualquer sistema operacional (Windows, Mac, Android, iOS).",
    },
    {
      question: "O sistema funciona para bar e lanchonete também?",
      answer:
        "Sim! O ComandaX foi desenvolvido para atender restaurantes, bares, lanchonetes, cafeterias, padarias e qualquer estabelecimento de food service. O sistema se adapta ao fluxo do seu negócio, seja atendimento em mesa, balcão ou delivery.",
    },
    {
      question: "Como funciona o controle de mesas?",
      answer:
        "O módulo de mesas do ComandaX permite que você cadastre todas as mesas do seu estabelecimento e visualize em tempo real quais estão livres ou ocupadas. Ao abrir uma comanda, você associa ela a uma mesa. Quando a comanda é fechada, a mesa fica automaticamente disponível.",
    },
    {
      question: "Posso usar o ComandaX no celular?",
      answer:
        "Sim! O ComandaX é totalmente responsivo e funciona perfeitamente em smartphones e tablets. Seus garçons podem anotar pedidos diretamente pelo celular, e você pode acompanhar tudo de qualquer lugar pelo seu dispositivo móvel.",
    },
    {
      question: "O ComandaX gera relatórios de vendas?",
      answer:
        "Sim. O sistema oferece relatórios detalhados de vendas, produtos mais pedidos, faturamento por período e outras estatísticas essenciais para a gestão do seu negócio. Todos os dados ficam disponíveis em dashboards visuais e intuitivos.",
    },
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title:
        "ComandaX - Comanda Digital para Restaurantes, Bares e Lanchonetes | Sistema Grátis",
      description:
        "Sistema de comanda digital gratuito para restaurantes, bares, lanchonetes e cafeterias. Gerencie pedidos, mesas, cardápio e relatórios de vendas. Comece grátis hoje!",
      keywords:
        "comanda digital, comanda eletrônica, sistema para restaurante, sistema de comandas, sistema para bar, sistema para lanchonete, cardápio digital, gestão de restaurante, controle de mesas, pedidos digitais, software restaurante, sistema food service, comanda digital grátis, PDV restaurante",
      type: "website",
    });
  }

  scrollToAnchor(anchorId: string) {
    const element = document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: "smooth" });
  }
}
