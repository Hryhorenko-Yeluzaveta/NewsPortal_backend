import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {News} from "./news.entity";
import {NewsService} from "./news.service";
import {NewsController} from "./news.controller";
import {User} from "../User/user.entity";
import {JwtStrategy} from "../Auth/strategy/jwt.strategy";
import {Category} from "../Category/category.entity";
import {UserModule} from "../User/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([News, Category]), UserModule],
    controllers: [NewsController],
    exports: [TypeOrmModule.forFeature([News])],
    providers: [NewsService, JwtStrategy]
})

export class NewsModule {}
