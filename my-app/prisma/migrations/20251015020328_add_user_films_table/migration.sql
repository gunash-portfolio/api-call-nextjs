-- CreateTable
CREATE TABLE "public"."UserFilms" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFilms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserFilms_userId_idx" ON "public"."UserFilms"("userId");

-- CreateIndex
CREATE INDEX "UserFilms_movieId_idx" ON "public"."UserFilms"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFilms_userId_movieId_key" ON "public"."UserFilms"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "public"."UserFilms" ADD CONSTRAINT "UserFilms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFilms" ADD CONSTRAINT "UserFilms_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
