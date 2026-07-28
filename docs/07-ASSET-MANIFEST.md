# 07 — Manifesto de assets

## Brand

| Ficheiro | Uso | Estado |
|---|---|---|
| `assets/brand/cartao-visita-referencia.jpg` | contactos e serviços | referência factual |
| `assets/brand/logo-referencia-principal.jpg` | reconstrução vetorial | não publicar como ficheiro final |
| `assets/brand/logo-lockups-referencia.jpg` | versões clara/escura | não publicar como ficheiro final |

## Generated

| Ficheiro | Papel |
|---|---|
| `01-hero-institucional-final.png` | resultado/hero da cutscene |
| `02-scroll-frame-inicial-antes.png` | cena inicial |
| `03-scroll-frame-pintura-em-andamento.png` | preparação |
| `04-scroll-frame-acabamento-quase-concluido.png` | acabamento |
| `05-execucao-tecnica-pintura.png` | execução técnica |
| `06-splash-transicao-marca.png` | transição líquida |
| `inovare-cutscene-abertura-v1.mp4` | preview de 9,5 s |

Todos possuem provenance `generated`.

## Gallery real

| ID | Ficheiro | Categoria | Estado |
|---|---|---|---|
| real-001 | `01-edificio-residencial-pintura-exterior.jpg` | exteriores | resultado |
| real-002 | `02-cobertura-estado-inicial.jpg` | coberturas | antes |
| real-003 | `03-moradia-preparacao-exterior.jpg` | exteriores | durante |
| real-004 | `04-moradia-acabamento-final.jpg` | exteriores | resultado |
| real-005 | `05-edificio-trabalho-em-altura.jpg` | exteriores | durante |
| real-006 | `06-terraco-impermeabilizacao-final.jpg` | coberturas | resultado |
| real-007 | `07-terraco-estado-inicial.jpg` | coberturas | antes |
| real-008 | `08-interior-resultado-final.jpg` | interiores | resultado |
| real-009 | `09-interior-durante-execucao.jpg` | interiores | durante |
| real-010 | `10-moradia-primer-com-andaime.jpg` | exteriores | durante |
| real-011 | `11-moradia-final-ocre.jpg` | exteriores | resultado |

## Pares seguros

### Terraço/cobertura

- antes: real-007;
- depois: real-006.

Este par parece corresponder ao mesmo espaço. Confirmar com o cliente antes de
usar um slider rotulado “antes/depois”.

### Interior

- durante: real-009;
- depois: real-008.

Mesmo ambiente aparente. Confirmar.

### Moradia ocre

- durante: real-010;
- resultado: real-011.

Par confirmado pela narrativa anterior, mas validar que é a mesma intervenção.

## Tratamento obrigatório

1. conservar original;
2. remover EXIF antes da publicação;
3. criar versões AVIF/WebP;
4. gerar thumbnails;
5. definir largura/altura;
6. escrever alt text;
7. não fazer upscale agressivo;
8. verificar matrículas, números de porta e rostos;
9. obter consentimento quando alguém for identificável.

## Alt text inicial

- real-001: “Fachada branca de edifício residencial após pintura exterior.”
- real-002: “Cobertura de edifício antes da limpeza e intervenção.”
- real-003: “Moradia branca durante preparação de pintura exterior.”
- real-004: “Moradia com fachada clara após acabamento exterior.”
- real-005: “Trabalho de pintura em altura num edifício residencial.”
- real-006: “Terraço com pavimento renovado e paredes brancas.”
- real-007: “Terraço antes da limpeza e renovação do pavimento.”
- real-008: “Sala com acabamento interior em branco e grafite.”
- real-009: “Sala protegida durante trabalho de pintura interior.”
- real-010: “Moradia com andaime durante preparação da fachada.”
- real-011: “Moradia com acabamento ocre e molduras claras.”

Os alt texts devem ser revistos conforme o crop e o contexto onde aparecem.

