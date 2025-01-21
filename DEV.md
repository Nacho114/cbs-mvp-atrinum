# Tech Stack Comments

## Setup 

Domain name dependent settings: 

1. Under Supabase -> Authentication -> URL Configuration, make sure to set
the site domain name
2. There is a secret with the URL

### **Steps to Update the DB Schema**

#### 1. **Add the New Schema File**
Create a new TypeScript file in the `schema` folder for the new database table or entity. For example:
- `orders.ts` for a new `orders` table.

Define the schema for this table within the file using Drizzle's schema definition syntax.

#### 2. **Update the `index.ts` File**
In the `schema/index.ts` file, ensure the new schema is exported. This allows Drizzle to include it when generating migrations. Update it like so:
```typescript
// schema/index.ts
export * from './accounts';
export * from './payments';
export * from './profiles';
export * from './orders'; // Add your new schema file here
```

#### 3. **Generate the Migration**
Run the following command to generate a new SQL migration based on the updated schema:
```bash
npm run db:generate
```
This will scan your schema files and create a migration file reflecting the changes in the database structure.

#### 4. **Inspect the Migration File**
Open the generated SQL file in the migrations folder to review the proposed changes. Ensure they align with your intentions (e.g., new table creation, column additions, etc.).

#### 5. **Apply the Migration**
Push the migration to the database:
```bash
npm run db:push
```
This will execute the migration and update your database schema in Supabase.

---

### **Why Use `index.ts` for Exports?**
The `index.ts` file acts as a central hub, consolidating and organizing all your schema files. Instead of manually including every schema file in your migration or application logic, you can simply reference the `index.ts` file, which aggregates all the exports. This keeps your code clean and reduces duplication or missed inclusions.

---

### **Benefits of This Approach**
1. **Modularity:** Each schema has its own file, making it easy to locate and update.
2. **Scalability:** Adding a new table only requires updating the `schema` folder and `index.ts`.
3. **Error Reduction:** Centralized exports minimize the risk of forgetting to include a schema file during migration generation.

Let me know if you’d like further clarification!---

## **Supabase**

> Note: On the free tier, if a project is unused for one week, it stops automatically.

Supabase provides a one-stop solution for **Auth**, **Database**, **Storage**, and **Lambda Functions**.

### **Useful Documentation**

- [Auth Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [API Reference](https://supabase.com/docs/reference/javascript/typescript-support)

### **Reset Password Template**

The reset password template contains critical links. If these paths change, the template needs to be updated accordingly.

- [Reset Flow Docs](https://supabase.com/docs/guides/auth/passwords?queryGroups=language&language=js&flow=pkce&queryGroups=flow#resetting-a-password)

**Current Template Example:**

```html
<h2>Reset Password</h2>
<p>Hello world.</p>
<p>Follow this link to reset the password for your user:</p>
<a
  href="{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset/update-password"
>
  Reset Password
</a>
```

- The URL contains:
  - `api/path`
  - `/reset/update-password`

If these paths change, update the template.

---

## **Drizzle ORM**

To setup Drizzle with Supabase, the

```
DATABASE_URL="....[YOUR-PASSWORD]...."
```

path can be found under Supabase->Settings, then on the top of the screen, click on connect, and then on ORMs.

Note that within the URL, `[YOUR-PASSWORD]` needs to be changed with the DB password. (Which Ignacio stored in Bitwarden)

A powerful and lightweight ORM for interacting with the database.

- [Setup Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
  - How to set up Drizzle with Supabase
  - Pushing migrations and schema management

---

## **Important**

**Atrinum Database Credentials**  
The Atrinum DB credentials are stored in **Bitwarden** under the login for `isa@atrinum.com`. Check the corresponding field for Supabase credentials.

---

## **TODO / Maybe**

- [Zod](https://zod.dev/) for schema validation
- [Drizzle](https://orm.drizzle.team/) for ORM and migrations

---

This Markdown format organizes the content for readability and structure while preserving the original intent. Let me know if you’d like further refinements! 😊

