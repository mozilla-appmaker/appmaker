Você quer criar um componente?

Isso é ótimo, nós queremos trabalhar junto com você! Nesse guia, você aprenderá o que são componente, como eles são construídos, como criar seus próprios componentes e por fim como enviar um componente que esteja pronto para o Appmaker.

## Índice

1. [O que é um componente?](#1---o-que-é-um-componente)
2. [Como componentes são construídos?](#2---como-componentes-são-construídos)
3. [Crie o seu próprio componente](#3---criando-o-seu-componente)
4. [Enviando o seu componente para o Appmaker](#4---enviando-o-seu-componente-para-o-appmaker)

#1 - O que é um componente?

Componentes são os blocos de contrução básicos de aplicativos do Appmaker. Cabeçalhos de páginas, botões e contadores são exemplos de componentes -- pequenas unidades distintas de funcionalidade ou interface que podem ser conectadas para criar um aplicativo complexo.

### Como componentes se comunicam?

Componentes podem difundir e escutar em canais coloridos. Um componente pode ter qualquer número de canais nomeados ou métodos de escuta, que um autor de componentes podem configurar no designer do Appmaker. Métodos de difusão e escuta podem também ser configurados para estarem ligados por padrão. No designer do Appmaker, as difusões são configuradas do lado direito do componente, as escutas no lado esquerdo.

### Um exemplo

In  this example, the Button component broadcasts a "Click" message when  clicked or tapped, and the Counter listens to it with it's CountUp method, increasing the counter.
Nesse exemplo, o compoente Botão difunde uma mensagem "Click" quando clicado ou tocado, e o Contador escuta por essa mensagem com o seu método `CountUp`, incrementando o contador.

[Check Sample App](https://appmaker.mozillalabs.com/designer?remix=http%253A%252F%252Fbroad-plants-495.appalot.me%252Findex.html)

#2 - Como componentes são construídos?

Componentes são construídos com HTML, CSS e Javascript, usando um framework chamado [Polymer](http://www.polymer-project.org/polymer.html).

### Introduzindo o componente Contador

Vamos olhar o componente Contador para começar. Ele conta para cima e para baixo quando recebe um sinal e mantém o registro da contagem.

Verifique o [repositório do componente Contador](https://github.com/mozilla-appmaker/component-counter).

* O **HTML e Javascript** está no arquivo [component.html](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.html)
* Os estilos **CSS** styles estão no arquivo [component.css](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.html)

Essa convenção se mantém para todos os componentes, apesar de você poder linkar arquivos CSS externos para o seu componente também.

### Partes de um componente

1. [Nome do componente](#nome-do-componente)
2. [Métodos de difusão](#métodos-de-difusão)
3. [Métodos de escuta](#métodos-de-escuta)
4. [Atributos editáevis](#atributos-editáveis)
5. [Adicionando estilo a um componente](#adicionando-estilo-a-um-componente)

### Nome do componente

O nome do componente deve conter um prefixo `ceci-` e estar definido da mesma forma em dois lugares diferentes.

1. A tag de componente - `<polymer-element name="ceci-counter" extends="ceci-element" attributes="unit increment value>`
2. A definição do Polymer - `Polymer("ceci-counter", { …`

Também há um nome no `ceci-definition` do componente, mas isso é usado para localização e não precisa ser igual aos nomes anteriores. Você pode ignorar isso por enquanto.

* A ceci-definition - `<script type="text/json" id="ceci-definition"> { "name": "Counter", …`


### Métodos de envio

Um componente pode ter qualquer número de métodos de envio, inclusive nenhum. Aqui está o método de envio `count` do componente Contado. Ele difunde o valor da contagem atual. Definindo o método de envio dessa forma, ele expõe esse componente na interface do usuário do designer do Appmaker. Criadores de componentes podem ligar o envio de `count` definindo uma cor para o canal.

```
"broadcasts": {
  "currentCount": {
    "label": "Current Count",
    "description": "Broadcasts the current count."
  }
}
```

* "Rótulo" - O nome que aparece no menu de envio no designer do Appmaker.
* "Descrição" - Descreve o método de envio no designer do Appmaker.
* "Padrão" - Se for `true`, esse modo de envio é ligado por padrão. Esse método de envio é ligado por padrão no designer do Appmaker no canal azul. Você também pode setar a cor explicitamente. As opções são:
 * azul
 * roxo
 * rosa
 * vermelho
 * laranja
 * amarelo
 * verde

**Chamando o método de envio**

Para usar o método de envio `count` no código do componente, você tem que chamar o método _built-in_ de envio, dessa forma:

```
this.broadcast("currentCount", this.value);

```

O segundo parâmetro (this.currentCount) no método `broadcast` pode ser usado para difundir qualquer tipo de dado: strings, números, vetores ou objetos JSON.

### Métodos de escuta

Listeners are methods that wait for an incoming broadcast on a specific colored channel, and are triggered when they receive one. Here's the countUp listener for the Counter component.
Métodos de escuta são métodos que esperam por uma mensagem difundida num canal colorido específico, e são executados quando eles recebem uma mensagem. Aqui está o método countUp do componente Contador.


```
"listeners": {
  "countUp": {
    "description": "Increment the current count by the increment value",
    "label": "Count Up",
    "default" : true
  }
}
```

Quando o método de escuta countUp recebe um sinal no canal da cor em que está ouvindo, e dispara a função correspondente dentro do componente. Isso faz com que o contador seja incrementado no valor do incremento definido.

```
countUp: function() {
  this.value = Number(this.value) + Number(this.increment, 10);
}
```

Para fazer uso do valor que é enviado na difusão, nós podemos usar uma variável na função de escuta, nesse caso 'countby'. Se recebermos um número on canal em que estamos escutando, podemos usar esse valor para incrementar o contador, dessa forma...

```
countUp: function(countby) {
  this.value = Number(this.value) + Number(countby, 10);
}
```

### Atributos editáveis

Componentes tem atributos editáveis. O designer do Appmaker expõe esses atributos no lado direito quando o componente é selecionado e permite ao criador do aplicativo modificá-lo.

Aqui estão as propriedades editáveis do Contador:

```
"attributes": {
  "unit": {
    "description": "Name for items which are being counted.",
    "label": "Unit",
    "editable": "text"
  },
  "increment": {
    "description": "Count up or down with this number.",
    "label": "Increment By",
    "editable": "number",
    "min" : 1
  }
}
```

* "label" - Rotula a interface do usuário do atributo editável no designer do Appmaker
* "designer" - Descrição para o atributo no designer do Appmaker
* "editable" - o tipo de valor que é esperado, determina a interface do usuário de edição no designer do Appmaker

**Tipos de editáveis**
* "text" - mostra uma caixa de texto básica
* "number" - mostra uma entradede números e opcionalmente observa valores de mínimo (min) e máximo (max).
* "boolean"- mostra uma caixa de seleção com o valor do atributo coo verdadeiro ou falso
* "colorpicker" - exibe um seletor de cor

Dentro do seu componente, você pode acessar o valor do atributo usando `this.attributename`.

**Atributos como escuta**

Você pode também transformar seus atributos em escutas automaticamente para mudar seu valor. Aqui vamos transformar o atributo chamado **label** em uma escuta e habilitar a escuta por padrão, e definí-la para o canal "vermelho".

`
"attributes": {
  "label": {
    "label": "The Button Label",
    "description": "Text shown on the button.",
    "editable": "text",
    "defaultListener" : "red",
    "listener": true
  },
}
`

### Adicionando estilo a um componente

Componentes ocupam a largura total do aplicativo e se empilham verticalmente, então lembre-se disso quando for desenhar seus componentes.

Estilos para um componente ficam no arquivo [component.css](https://github.com/mozilla-appmaker/component-counter/blob/gh-pages/component.css).

O prefixo **:host** dentro da folha de estilo referencia diretamente o componente e adiciona escopo com seletores aninhados também, então inclua-o na frente de todas as suas regras.


```
:host {
  display: block;
  width: 100%;
  height: 50px;
}

:host .counter {
  line-height: 3.8rem;
  text-align: center;
  font-size: 1.6rem;
  font-family: "FiraSans", sans-serif;
  padding: .5rem 0rem;
  background: #0Da;
  color: #666;
}
```

# 3 - Criando o seu componente

### Opção 1 - Use o repositório de modelo de componente start-here

Para ajudar você a criar o seu primeiro componente, nós criamos o **[repositório start here](https://github.com/mozilla-appmaker/start-here/)**.  Ele irá te ajudar a criar o seu primeiro componente e rodá-lo localmente no seu ambiente local enquanto você trabalha nele. Siga as instruções no arquivo README.md para começar.

Assim que você tiver seu componente rodando localmente, você pode adicioná-lo ao Appmaker e qualquer alteração feita no seu componente local será imediatamente propagada para o designer.

**Cuidado:** Esse componente só funcionará dentro do Appmaker enquanto o seu servidor local estiver rodando, então eventualmente você vai querer hospedar o componente no [GitHub Pages](http://pages.github.com/) e adicioná-lo ao Appmaker de lá. Esse procedimento é descrito a sequir...

### Opção 2 - Adicionar um componente do GitHub pages

Você também pode adicionar um componente ao Appmaker se ele estiver hospenado no [GitHub Pages](http://pages.github.com/). Para fazê-lo...

1. Crie um componente e hospede-o no GitHub.
2. Tenha certeza de que o componente esteja num branch chamado gh-pages.
3. No Appmaker, encontre o **Adicionar componente** na lista suspensa do usuário (acima e à direita do editor).
4. Adicione a URL do componente no branch gh-pages.

**Cuidado novamente:** Usuários podem instalar aplicativos com os seus próprios componentes, mas eles não serão carregados por outros criadores no Appmaker quando eles tentarem remixar seu aplicativo.

# 4 - Enviando o seu componente para o Appmaker

Por acaso você fez um componente sensacional que você acha que todo mundo deveria poder usar? Ótimo, aqui está o que você precisa fazer...
Did you make an awesome component that you think everyone should be able to use? Great, here's what you do...

1. Publish the component somewhere on GitHub.
2. Adicione uma issue no [Appmaker Issues List](https://github.com/mozilla-appmaker/appmaker/issues) com um link para o repositório, uma descrição do componente e adicione a tag **Proposed Component** à issue.
3. Nós vamos revisar seu componente e adicioná-lo ao Appmaker.

Componentes devem também ter testes unitários e estarem localizados, e nós vamos prover guias para isso num futuro próximo.
