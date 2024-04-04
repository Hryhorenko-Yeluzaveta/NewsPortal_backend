import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors,
    Param,
    UseGuards, UploadedFile,
} from '@nestjs/common'
import {FileInterceptor} from "@nestjs/platform-express";
import {Response, Request} from 'express'
import {NewsService} from "./news.service";
import {diskStorage} from "multer";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}
    @UseGuards(JwtAuthGuard)
    @Post('/:categoryId')
    @UseInterceptors(FileInterceptor('imageSrc', {
        storage: diskStorage({
                destination: './uploads/news',
                filename: (req, file, callback) => {
                    callback(null, file.originalname)
                }
            }
        )
    }))
    async createNews(@UploadedFile() image: Express.Multer.File, @Param('categoryId') categoryId: number , @Req() req: Request, @Res() res: Response)
    {
        try {
            const imagePath = image ? image.path : null;
            const newNews = await this.newsService.createNews(req.body, req.user['id'], imagePath, categoryId)
            return res.status(201).json(newNews);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getNewsById(@Param('id') id: number, @Res() res: Response) {
        const foundNews = await this.newsService.getNewsById(id)
        return res.status(200).json(foundNews)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/category/:id')
    async getNewsByCategory(@Res() res: Response, @Param('id') category: number) {
        const foundNews = await this.newsService.getNewsByCategory(category)
        return res.status(200).json(foundNews)
    }
    @UseGuards(JwtAuthGuard)
    @Get('/author/:id')
    async getAllNews(@Param('id') userId: number, @Res() res: Response) {
        const foundNews = await this.newsService.getNewsByUserId(userId)
        return res.status(200).json(foundNews)
    }


    @Get('uploads/news/:filename')
    serveImage(@Param('filename') filename: string, @Res() res: Response) {
        return res.sendFile(filename, {root: './uploads/news'});
    }
}