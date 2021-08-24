# backend-remote-test

O objetivo deste projeto é ser um código com casos de testes (asserts), que validem que um projeto de backend foi feito como esperado, enviando requisições pré-definidas para os projetos e conferindo seus retornos.

# O projeto

- Será necessário criar projeto Node com Jest, que a cada vez que for rodado, receberá uma url, que será o endereço do projeto online a ser testado; Exemplo: `yarn test --url:http://18.228.136.80:3100/` `process.argv`
- Executaremos cada um dos testes via terminal: 
```
yarn test --url:http://apiA:3100/
yarn test --url:http://apiB:3100/
yarn test --url:http://apiC:3100/
```
- Será necessário que este projeto faça chamadas http usando axios;
- Realizaremos então uma chamada da api `backend-remote-test` de cada projeto, para saber quais projetos funcionaram ou não;
- O projeto deverá testar cada requisito (explicado abaixo) e apresentar um somatório de "pontos"
- Cada validação dará X pontos

## Para cada projeto

- Apresentar um console.log("Url sendo testada", url)
- Registrar o tempo que levará a primeira requisição abaixo, e salvar os dados retonados localmente
- Enviar get na raiz e confirmar que: foi retornado status 200, retornado um json, retornado um array, tenha pelo ao menos 20 itens, o primeiro item tenha 'appId` e `name` (10 pontos)
- Enviar get na rota /nao-exista e confirmar que: é retornado status 404 (10 pontos) (estou validando)
- Enviar get para rota /:id (onde id será o `appId` do primeiro item da lista obtida acima), e confirmar: foi retorno status 200, o `name` é o mesmo do primeiro item da lista, que tenha vindo os atributos `type`, `detailed_description`  (10 pontos)

## Conferindo recursos adicionais

- Enviar post para /favorite sem `user-hash` no header e confirmar que: retorne status 403 ou 400 (salvar favorito, sem passar usuário) (10 pontos) (estou validando) 
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200 ou 204 e/ou um array vazio (10 pontos) 👌
- Enviar post para /favorite enviando `user-hash` (com uma string sua) no header, e `appId` e `rating` e confirmar que: foi retornado status 200 (10 pontos) (não falei qual o nome do atributo, e não falei se appId iria no body ou na url)
- Enviar novamente get para /favorite sem `user-hash` no header e confirmar que: retorne status 200 ou 204 e/ou um array vazio (10 pontos) 👌
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200, retorne um array, o array tenha um item apenas, o item seja o `appId` enviado, tenha retornado os atributos `type`, `detailed_description`(10 pontos) `{ appId, rating, game: { type, detail } }` / `{ appId, rating, type, detail }`

## Excendendo as expectativas (validar cache)

- Obter novamente a raiz e confirmar que que o tempo de obtenção foi pelo ao menos de 40% do tempo de obtenção anterior (20 pontos)
- Conferir que os valores retornados são os mesmos da primeira requisição 

## Apresentação e resultados

![Exemplo bem diferente 😅](https://flaviocopes.com/jest/passing-tests.png "Exemplo bem diferente 😅")

- Para cada teste o Jest irá apresentar se "deu certo" ou não
- Apresentar no final um console.log("Total de pontos do candidato") com o somatório de pontos totais

# Repositório


- Crie um branch pra você e implemente sua solução
- Dê push para seu branch e nos avise
