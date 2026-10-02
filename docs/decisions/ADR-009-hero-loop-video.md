# ADR-009 — Vídeo contínuo, narrativa apenas no texto

Pedido explícito do cliente em 02/10/2026 substitui a estratégia de imagens da ADR-008.
O MP4 fornecido tem 9,96 s, 1920×1080, 24 fps. Derivados H.264 sem áudio,
yuv420p e faststart: desktop 1080p; mobile com recorte central 9:16, 720p.
Proveniência: cena gerada/ilustrativa, excluída da galeria de obras reais.

Vídeo independente da rolagem; Um listener passivo de scroll, agrupado com requestAnimationFrame, atualiza apenas texto e indicador. Sem dependência de GSAP no hero.
Sticky CSS usa altura estável svh. Poster é visível antes do vídeo, sem JS,
com autoplay bloqueado e com movimento reduzido. Sem JS e com movimento
reduzido há um único ecrã com promessa e contactos. Botão pausa o vídeo;
aba oculta pausa reprodução. Texto invisível também fica fora do foco.

A pedido do cliente, remover halo radial e qualquer véu sobre a cena. Sombras apenas no texto. Marca, promessa e contactos também visíveis na abertura.

Com movimento reduzido, o botão Reproduzir vídeo permite opt-in explícito, sem alterar preferências do dispositivo; contactos continuam visíveis e o percurso fica num só ecrã.
