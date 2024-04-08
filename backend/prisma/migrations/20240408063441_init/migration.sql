/*
  Warnings:

  - You are about to drop the column `sessionOfX` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `sessionOfY` on the `Game` table. All the data in the column will be lost.
  - Added the required column `session1` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session2` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "gameId" TEXT NOT NULL PRIMARY KEY,
    "session1" TEXT NOT NULL,
    "session2" TEXT NOT NULL,
    "lastActionTimestamp" DATETIME NOT NULL,
    "state" TEXT NOT NULL
);
INSERT INTO "new_Game" ("gameId", "lastActionTimestamp", "state") SELECT "gameId", "lastActionTimestamp", "state" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
