import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import {Request, Response} from 'express'
import {CategoryService} from "./category.service";
import {JwtAuthGuard} from "../Auth/guards/jwt-auth.guard";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllCategories(@Res() res: Response) {
        const categories = await this.categoryService.getAllCategories()
        return res.status(200).json(categories)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getCategoryById(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
        const findedCategory = await this.categoryService.getCategoryById(id)
        return res.status(200).json(findedCategory)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createCategory(@Req() req: Request, @Res() res: Response) {
        const category = await this.categoryService.createCategory(req.body)
        return res.status(201).json(category)
    }

}