import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Equal, Repository} from 'typeorm'
import {News} from "./news.entity";
import {User} from "../User/user.entity";
import {Category} from "../Category/category.entity";
import {UserService} from "../User/user.service";

@Injectable()
export class NewsService {
    constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>,
                @InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
                private userService: UserService) {
    }

    public async createNews(newsData: News, userId: number, imageSrc: string, categoryId: number) {
        try {
            const user = await this.userRepository.findOne({where: {id: userId}})
            const category = await this.categoryRepository.findOne({where: {id: categoryId}})
            const news = this.newsRepository.create({...newsData, author: user, imageSrc, category});
            return await this.newsRepository.save(news)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getNewsById(id: number) {
        try {
            return this.newsRepository.findOne({where: {id}, relations: {comment: true, author: true}})
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getNewsByCategory(categoryId: number) {
        try {
            return this.newsRepository.find({
                where: {category: Equal(categoryId)},
                select: ['id', 'name', 'imageSrc', 'author', 'text', 'date'],
                order: {date: 'DESC'}
            })
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getNewsByUserId(userId: number) {
        try {
            return this.newsRepository.find({
                where: {author: Equal(userId)},
                relations: {author: true},
                order: {date: 'DESC'}
            })
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}