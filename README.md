# Dreams RUSH — loja virtual

Frontend da loja Dreams RUSH com catálogo, filtros, carrinho persistente e checkout em 3 etapas.

## O que funciona agora
- Catálogo e filtros
- Produto e seleção de tamanho
- Carrinho com quantidade, remoção e persistência em localStorage
- Checkout com dados do cliente
- Consulta automática de CEP via ViaCEP (quando houver internet)
- Cálculo de frete demonstrativo (grátis acima de R$ 199; padrão R$ 19,90)
- Tela de seleção de método de pagamento (Pix/cartão)
- Tela de revisão antes do gateway

## O que falta para cobrar de verdade
O projeto termina propositalmente antes do processamento financeiro. Para produção, conecte um backend e um provedor de pagamento (por exemplo, Mercado Pago ou Stripe), além de banco de dados, autenticação ADM, estoque e webhooks de pagamento.

Nunca coloque chaves secretas de pagamento no JavaScript público do GitHub Pages.
