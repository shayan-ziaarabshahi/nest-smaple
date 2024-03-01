import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { UserToken } from 'src/auth/types';
import { JWTGuard } from 'src/auth/guard';
import { CreateBookmarkDTO } from './dto';

@UseGuards(JWTGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmark: BookmarkService) {}

  @Get('')
  getBookmarks(@GetUser('sub') userId: UserToken['sub']) {
    return this.bookmark.getBookmarks(userId);
  }

  @Get(':id')
  getBookmark(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('sub') userId: UserToken['sub'],
  ) {
    return this.bookmark.getBookmark(userId, bookmarkId);
  }

  @Post('')
  createBookmark(
    @GetUser('sub') userId: UserToken['sub'],
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmark.createBookmark(userId, dto);
  }

  @Patch(':id')
  editBookmark(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('sub') userId: UserToken['sub'],
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmark.editBookmark(userId, bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @GetUser('sub') userId: UserToken['sub'],
  ) {
    return this.bookmark.deleteBookmark(userId, bookmarkId);
  }
}
