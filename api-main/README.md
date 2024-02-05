## Descrição

Integração Agência Nacional de Águas (ANA)

## Antes de tudo

Garanta que o você possui o Docker instalado em sua máquina.

## Instalação

```bash
npm i
```

## Subir o Docker

```bash
docker-compose -f docker-compose.local.yml up -d --build
```

## Rode o App

```bash
# desenvolvimento
npm run dev ana
```

## CRUD - Rotas

#### URL - http://localhost:3000/ana

<br />

```bash
POST: #/
  - name: "string";
```

```bash
GET #/ - LISTAGEM []
  - name: "string";
```

```bash
GET #/:id
  - name: "string";
```

```bash
PUT #/:id
  - name?: "string"; # opcional
```

```bash
DELETE #/:id
```
