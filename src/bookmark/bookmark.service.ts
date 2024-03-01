import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserToken } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: UserToken['sub']) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return bookmarks;
  }

  async getBookmark(userId: UserToken['sub'], bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        AND: [{ id: bookmarkId }, { user: { id: userId } }],
      },
    });
    return bookmark;
  }

  async createBookmark(userId: UserToken['sub'], dto: CreateBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmark(
    userId: UserToken['sub'],
    bookmarkId: number,
    dto: EditBookmarkDTO,
  ) {
    let bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('access denied');

    bookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  async deleteBookmark(userId: UserToken['sub'], bookmarkId: number) {
    let bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('access denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      }
    });
  }
}
