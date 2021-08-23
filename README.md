# backend-remote-test

O objetivo deste projeto é ser um código de casos de testes, que validem que um projeto de backend foi feito como esperado, 
enviando requisições pré-definidas para os projetos e conferindo seus retornos.

# Este projeto

- Será necessário criar projeto Node "sem nada", e implementar apenas testes unitários com jest;
- Poderá haver um arquivo "projects.js" que terá um array de objetos no formato abaixo
```
[
  {name: "Tiago", email: "tiago@tiago.com", projectUrl: "https://www..."},
  ...
]
```
- Ao iniciar o projeto com algo como `yarn test` esta lista de projetos deverá ser lida, para que cada projeto possa ser testado;   
- Uma opção, pode ser executar **apenas uma url**, ao invés de executar todas, porque executar todas no teste pode ficar difícil entender os resultados


## Para cada projeto

- Ao iniciar o teste, printar o nome, email e url do teste atual no console
- Registrar o tempo que levará a primeira requisição abaixo, e salvar os dados retonados localmente
- Enviar get na raiz e confirmar que: foi retornado status 200, retornado um json, retornado um array, tenha pelo ao menos 20 itens, o primeiro item tenha 'appId` e `name`
- Enviar get na rota /abc e confirmr que: é retornado status 404
- Enviar get para rota /:id (onde id será o `appId` do primeiro item da lista obtida acima), e confirmar: foi retorno status 200, o `name` é o mesmo do primeiro item da lista, que tenha vindo os atributos `type`, `detailed_description`  

## Conferindo recursos adicionais

- Enviar post para /favorite sem `user-hash` no header e confirmar que: retorne status 403 ou 400
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200 ou 204 e um array vazio
- Enviar get para /favorite 
- Enviar post para /favorite enviando `user-hash` "app-masters" no header, e `appId` e `rating` e confirmar que: foi retornado status 200
- Enviar novamente get para /favorite sem `user-hash` no header e confirmar que: retorne status 403 ou 400 e um array vazio
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200, retorne um array, o array tenha um item, o item seja o `appId` enviado, tenha retornado os atributos `type`, `detailed_description`

## Excendendo as expectativas (validar cache)

- Obter novamente a raiz e confirmar que que o temo de obtenção foi pelo ao menos metade da obtenção anterior
- Conferir que os valores retornados são os mesmos da primeira requisição

# Repositório

- Crie um branch pra você e implemente sua solução
- Dê push para seu branch e nos avise

