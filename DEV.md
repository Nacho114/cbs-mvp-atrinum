# Tech Stack Comments

## **Updating the DB**

> **DO NOT UPDATE THE DB SCHEMA MANUALLY IN SUPABASE**

Follow these steps for updating the database schema:

1. Change the Drizzle schema file (`schema.ts`).
2. Run:
   ```bash
   npm run db:generate
   ```
3. Inspect the generated SQL migration file to ensure correctness.
4. Push the migration:
   ```bash
   npm run db:push
   ```

To revert, simply go back to step 1 and adjust the schema accordingly.

---

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
