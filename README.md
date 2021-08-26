# backend-remote-test

O objetivo deste projeto é ser um teste escrito com Jest, com casos de testes (asserts) que 
validem que projetos de backend (do processo de seleção de agosto de 2021 da <a href='http://appmasters.io/'>App Masters</a>) foram feito como esperado.

Basicamente o teste envia requisições pré-definidas para a url informada, e confere os retornos.

O projeto foi sugerido por <a href='https://github.com/tiagoGouvea/'>Tiago Gouvêa</a> e foi desenvolvido por dois dos candidatos do processo de seleção; 
<a href='https://github.com/Muky-dev'>Gabriel Fini</a> e <a href='https://github.com/HallexCosta'>Hallex</a>.

# Como usar

Baixe este repositório, instale as dependências com `yarn` e então chame o teste passando sua url. Exemplo:

```
yarn test --url=http://url.da.sua.api.steam
```

Ao final do teste serão exibidos os erros e acertos, e será apresentada uma pontuação do projeto.