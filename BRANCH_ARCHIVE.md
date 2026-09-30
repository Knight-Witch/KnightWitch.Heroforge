# Witch Dock Branch Archive Ledger

**Status:** Binding ledger for retired permanent/critical branch snapshots  
**Canonical branch:** `WITCH_DEV_MAIN`

This ledger preserves retrievable immutable snapshots when a permanent or otherwise critical branch is intentionally replaced.

Archiving is **not** keeping an old branch forever.

## Archive mechanism

1. Read the branch's exact final head SHA.
2. Create an immutable Git tag:
   `branch-archive/<sanitized-branch>/<YYYYMMDD>-<shortsha>`
3. Verify the tag resolves to the exact final head SHA.
4. Record the archive below.
5. Remove the old branch from `BRANCH_REGISTRY.md` PENDING ARCHIVE.
6. Add the old branch ref + exact SHA to `BRANCH_DELETION_QUEUE.md`.
7. Delete the old branch during the next mechanical sweep.

If tag creation or verification is unavailable, the branch remains PENDING ARCHIVE and protected. Never delete the branch before the archive is proven.

Do not create `archive/*` branches as the archival mechanism.

## Archived branch snapshots

None yet.

Future records must contain:

| Former branch | Final head SHA | Archive tag | Replaced by | Approval / source | Archived date |
|---|---|---|---|---|---|
