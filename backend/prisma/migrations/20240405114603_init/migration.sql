-- CreateTable
CREATE TABLE "Lobby" (
    "sessionId" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "gameId" TEXT NOT NULL PRIMARY KEY,
    "sessionOfX" TEXT NOT NULL,
    "sessionOfY" TEXT NOT NULL,
    "lastActionTimestamp" DATETIME NOT NULL,
    "state" TEXT NOT NULL
);
