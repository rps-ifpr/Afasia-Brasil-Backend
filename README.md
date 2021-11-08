## Afásico Brasil - Backend
![Badge](https://img.shields.io/static/v1?label=DH&message=DOSOMETHINGGREAT&color=0070f3&style=<0070f3>&logo=rocket)

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

Para ter acesso ao banco de dados de produção, vamos precisar de uma ferramenta chamada **DBeaver**, uma ferramenta gratuita de banco de dados multiplataforma para desenvolvedores, administradores de banco de dados, analistas e todas as pessoas que precisam trabalhar com bancos de dados.

Para isso, será necessário fazer a instalação dela em sua máquina caso você ainda não tenha, e pra isso, basta acessar o link a seguir:

[https://dbeaver.io/](https://dbeaver.io/)

Após realizar a instalação e abrir a ferramenta, você verá uma tela muito semelhante a tela abaixo, e para iniciarmos, basta clicar no botão "+" em destaque na imagem a seguir:

![DB1.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dfa8231f-e076-4b97-9e9c-9f2a047822c3/DB1.png)

E então selecione a opção MariaDB / MySQL, em suma, ambas são a mesma coisa, porém neste caso podemos selecionar a opção MariaDB como mostra abaixo, e então prosseguir para a próxima etapa clicando no botão "Next" / "Seguinte".

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8bde5720-ee67-468c-9b52-2da5b022acee/Untitled.png)

Agora será necessário ter as informações do seu banco de dados em mãos, para que assim possamos prosseguir para sua conexão.

Com as credenciais em mãos, basta preencher os campos marcados na imagem abaixo de acordo com suas informações. 

- Suas credenciais de acesso ao banco
    
    Host do servidor / Server host: `104.131.99.230`
    
    Banco de dados / database: `afasicos_brasil`
    
    Porta / Port: `33306`
    
    Usuário / Username: `root`
    
    Senha / Password: `edaf3ef0d1cb11d377e516b9eb4ee8f6`
    

![DB2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/82dd9c10-a963-441c-a71f-577805324a81/DB2.png)

Logo em seguida clique no botão inferior da imagem para testar sua conexão.

Se a conexão estiver correta, a resposta do teste deve ser a seguinte:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/882e7dd5-0d81-481a-a053-4e35968870a4/Untitled.png)

Caso seja sua primeira vez manipulando um banco de dados MariaDB em seu computador através desta ferramente, é provável que aparece uma mensagem de solicitação, pedindo para instalar os driver's referente ao banco MariaDB, basta clicar em Download / Baixar, e prosseguir!

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/30753bb3-f15e-4c3d-aece-dd228e108698/Untitled.png)

Após tudo isso, basta clicar em Finish / Finalizar e pronto! A conexão já está salva na ferramenta dentro do seu computador e você já tem acesso aos dados da sua aplicação.

Agora basta acessar a árvore de pastas da sua base de dados e navegar entre as diferentes tabelas dentro do banco (dê dois cliques para abrir a tabela desejada), após isso, acesse a aba "Data" da tabela escolhida, como nas imagens abaixo:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a4d343a4-6506-4c5f-a67b-c1223321f81a/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c0cb7ddd-6d5e-4ec1-9962-bcb4f84ea6be/Untitled.png)

### Mais informações

- A tabela `users` é onde fica salva os dados de cada usuário em complemento a tabela `user_addresses` onde é salvo o endereço de cada usuário referenciado ao seu ID único.
- A tabela `activities` é referente as atividades.
- A tabela `results` é referente aos resultados de cada atividade realizada por um usuário, que por ventura, é referenciada a um usuário pelo seu ID e o mesmo vale para a atividade.

Para mais informações sobre o funcionamento da aplicação back-end, acesse a sua página de documentações localizada dentro do espaço de trabalho inicial.

Made with :blue_heart: by Rogerio Hessel :wave:
