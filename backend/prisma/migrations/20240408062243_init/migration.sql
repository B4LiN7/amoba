-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lobby" ("sessionId", "timestamp") SELECT "sessionId", "timestamp" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
