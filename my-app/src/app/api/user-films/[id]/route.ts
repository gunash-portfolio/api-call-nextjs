import { NextRequest, NextResponse } from 'next/server';

import  {auth}  from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Params{
  params:Promise<{
    id:string;
  }>;
}


// DELETE - Remove a movie from favorites
export async function DELETE(
  request: NextRequest,
  { params }: Params 
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const resolvedParams = await params;
    const userFilmId = parseInt(resolvedParams.id,10);

    if (isNaN(userFilmId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user film exists and belongs to this user
    const userFilm = await prisma.userFilms.findFirst({
      where: {
        id: userFilmId,
        userId: user.id,
      },
    });

    if (!userFilm) {
      return NextResponse.json(
        { error: 'Favorite film not found' },
        { status: 404 }
      );
    }

    // Delete the favorite
    await prisma.userFilms.delete({
      where: { id: userFilmId },
    });

    return NextResponse.json(
      { message: 'Film removed from favorites' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing film from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove film from favorites' },
      { status: 500 }
    );
  }
}

