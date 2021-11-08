## Afásico Brasil - Backend
![Badge](https://img.shields.io/static/v1?label=DH&message=DOSOMETHINGGREAT&color=0070f3&style=<0070f3>&logo=rocket)

Neste projeto, o back-end foi realizado em [AdonisJS](https://adonisjs.com/), um framework MVC Node.js que reduz o tempo de desenvolvimento por meio do foco nos detalhes essenciais de desenvolvimento, junto ao MySQL/MariaDB.

O front-end mobile foi realizado em [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/), excelentes tecnologias para desenvolvimento de aplicativos nativos com JavaScript.

Obs.: O projeto foi desenvolvimento majoritariamente com [TypeScript](https://www.typescriptlang.org/), como um superset para a linguagem [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

![Afásicos Brasil](https://play-lh.googleusercontent.com/G08lHX-2P4KJuQyrBb6g84hMd9wmRup0tKHAFvnh6FFsdRXT17KFNUTJkxr4OD29BrU=s360-rw)

## Documentações
---
[Back-end da aplicação](https://www.notion.so/Back-end-da-aplica-o-f8c629c9c920486b8f9880e826e5455f)

[Front-end da aplicação](https://www.notion.so/Front-end-Mobile-da-aplica-o-ba2a8fd4d0b44aa2b4f2da0d38350975)

### Principais Tecnologias

- [Node.js](https://nodejs.org/en/)
- [AdonisJS](https://adonisjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)

### Padrões de Código

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

### Requisitos básicos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
- [Git](https://git-scm.com)

O projeto pode ser construído com npm ou yarn, então escolha uma das abordagens abaixo caso você não tenha nenhum instalado em seu sistema.

O Npm é distribuído com o Node.js, o que significa que quando você faz o download do Node.js, o npm é instalado automaticamente no seu computador
- [Node.js v14.16.0](https://nodejs.org/) ou maior.

Yarn é um gerenciador de pacotes criado pela equipe do Facebook e parece ser mais rápido do que o npm em geral.
- [Yarn v1.22.5](https://yarnpkg.com/) ou maior.

Além disso, é bom ter um editor para trabalhar com o código, como [VSCode](https://code.visualstudio.com/).

### :information_source: Como executar

Siga as instruções abaixo para baixar e usar o projeto deste repositório:


```bash
# Clone este repositório usando SSH
$ git clone git@github.com:devs-sharbe/afasia-backend.git
# ou clone usando https
$ git clone https://github.com/devs-sharbe/afasia-backend.git

# Vá para o repositório
$ cd afasia-backend

# Instale as dependências
$ yarn

# Executar migrações do banco
$ node ace migration:run

# Executar projeto
$ node ace serve --watch
```

Lembre-se se verificar as informações necessárias e realizar as devidas alterações dentro de `.env.example`.

Certifique-se de possui um banco MySQL ou MariaDB e Redis em sua máquina para poder executar o banco de dados.

---

Made with :blue_heart: by Rogerio Hessel :wave:
