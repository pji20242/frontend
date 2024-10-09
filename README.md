# frontend

Código fonte da aplicação Web do usuário

## Possibilidades de implementação

### Kotlin (Nativo)

Prós:

- Desempennho superior: aplicativos nativos geralmente oferecem melhor desempenho e uma experiência mais fluida.
- Acesso total ao *hardware*: Acesso direto a APIs e recursos do dispositivo, como câmera, GPS etc.
- Melhor integração: integração mais fácil com bibliotecas e *frameworks* específicos do Android.
- Experiência do usuário: Interfaces podem ser otimizadas para seguir as diretrizes de *design* do Android.

Contras:

- Tempo de desenvolvimento: o desenvolvimento pode ser mais demorado, especialmente se você precisar criar versões separadas para iOS e Android.
- Recurso limitado: exige conhecimento específico de cada plataforma se você também quiser desenvolver para iOS.
- Manutenção: cada plataforma pode exigir uma manutenção separada, aumentando o custo e o tempo.

### React Native

Prós:

- Desenvolvimento rápido: permite compartilhamento de código entre plataformas, acelerando o tempo de desenvolvimento.
- Desempenho aceitável: embora não tão rápido quanto o nativo, oferece bom desempenho para muitos aplicativos.
- *Hot reloading*: Possibilidade de ver mudanças instantaneamente, facilitando o desenvolvimento.
- Comunidade ativa: grande ecossistema e suporte da comunidade, com muitas bibliotecas e *plugins* disponíveis.

Contras:

- Desempenho: pode não ser tão rápido quanto o nativo, especialmente para aplicativos complexos ou com muitas animações.
- Acesso limitado a APIs: pode haver limitações ao acessar APIs nativas ou a necessidade de usar *wrappers*.
- Atualizações e compatibilidade: dependência de atualizações da biblioteca, que pode afetar a compatibilidade com novas versões do sistema operacional.
