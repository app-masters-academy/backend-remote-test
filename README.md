# backend-remote-test

O objetivo deste projeto é ser um código com casos de testes (asserts), que validem que um projeto de backend foi feito como esperado, 
enviando requisições pré-definidas para os projetos e conferindo seus retornos.

# O projeto

- Será necessário criar projeto Node, com apenas uma rota GET e parâmetro `/test?url=...`, onde url será a o endereço do projeto online a ser testado;
- Realizaremos então uma chamada da api `backend-remote-test` de cada projeto, para saber quais projetos funcionaram ou não;
- A rota deverá retornar cada resultado abaixo com um somatório de "pontos"
- Cada validação dará X pontos

## Para cada projeto

- Registrar o tempo que levará a primeira requisição abaixo, e salvar os dados retonados localmente
- Enviar get na raiz e confirmar que: foi retornado status 200, retornado um json, retornado um array, tenha pelo ao menos 20 itens, o primeiro item tenha 'appId` e `name` (10 pontos)
- Enviar get na rota /abc e confirmr que: é retornado status 404 (10 pontos)
- Enviar get para rota /:id (onde id será o `appId` do primeiro item da lista obtida acima), e confirmar: foi retorno status 200, o `name` é o mesmo do primeiro item da lista, que tenha vindo os atributos `type`, `detailed_description`  (10 pontos)

## Conferindo recursos adicionais

- Enviar post para /favorite sem `user-hash` no header e confirmar que: retorne status 403 ou 400 (10 pontos)
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200 ou 204 e um array vazio (10 pontos)
- Enviar post para /favorite enviando `user-hash` "app-masters" no header, e `appId` e `rating` e confirmar que: foi retornado status 200 (10 pontos)
- Enviar novamente get para /favorite sem `user-hash` no header e confirmar que: retorne status 403 ou 400 e um array vazio (10 pontos)
- Enviar get para /favorite com `user-hash` no header e confirmar que: retorne status 200, retorne um array, o array tenha um item, o item seja o `appId` enviado, tenha retornado os atributos `type`, `detailed_description`(10 pontos)

## Excendendo as expectativas (validar cache)

- Obter novamente a raiz e confirmar que que o temo de obtenção foi pelo ao menos metade da obtenção anterior (20 pontos)
- Conferir que os valores retornados são os mesmos da primeira requisição 

# Repositório

- Crie um branch pra você e implemente sua solução
- Dê push para seu branch e nos avise
