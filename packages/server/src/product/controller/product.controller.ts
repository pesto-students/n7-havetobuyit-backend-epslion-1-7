import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import Joi from 'joi';
import {
  AvailableReactions,
  Product,
  PublishProductPayload,
  Review,
} from '../../interfaces/product.interface';
import { JoiValidationPipe } from '../../shared/pipes/validation.pipe';
import { UserRoles } from '../../interfaces/user.interface';
import { JwtAuthGuard } from '../../shared/auth/jwt-auth.guard';
import { Roles } from '../../shared/auth/roles.decorator';
import { RolesGuard } from '../../shared/auth/roles.guard';
import { HttpExceptionFilter } from '../../shared/filters/http-exception.filter';
import { ProductService } from '../../shared/product/product.service';
import {
  createProductSchema,
  createProductSwaggerSchema,
  idSchema,
  productIdSchema,
  productIdSwaggerSchema,
  reactionSchema,
  reactionSwaggerSchema,
  reviewSchema,
  reviewSwaggerSchema,
  updateProductSchema,
  updateProductSwaggerSchema,
} from './validation.schema';
import {
  DefaultProductSkip,
  DefaultProductsLimit,
} from '../../shared/config/constants';
import { ApiBody } from '@nestjs/swagger';

@Controller('product')
@UseFilters(new HttpExceptionFilter())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:skip/:limit')
  getProducts(
    @Param(
      'skip',
      new JoiValidationPipe(Joi.number().default(DefaultProductSkip)),
    )
    skip: string,
    @Param(
      'limit',
      new JoiValidationPipe(Joi.number().default(DefaultProductsLimit)),
    )
    limit: string,
  ) {
    return this.productService.getProducts(parseInt(skip), parseInt(limit));
  }

  @Get('/random')
  async getRandomProduct() {
    return (await this.productService.getRandom())[0];
  }

  @Post('new')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: createProductSwaggerSchema,
  })
  createProduct(
    @Body(new JoiValidationPipe(createProductSchema)) productPayload: Product,
  ) {
    return this.productService.create(productPayload);
  }

  @Post('request-publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: productIdSwaggerSchema,
  })
  publishProduct(
    @Req() request,
    @Body(new JoiValidationPipe(productIdSchema))
    body: PublishProductPayload,
  ) {
    return this.productService.publishProduct(
      body.productId,
      request.user.userId,
    );
  }
  @Patch('un-publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: productIdSwaggerSchema,
  })
  unPublish(
    @Req() request,
    @Body(new JoiValidationPipe(productIdSchema))
    body: PublishProductPayload,
  ) {
    return this.productService.unPublish(request.user.userId, body.productId);
  }

  @Patch('/:productId/reaction')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: reactionSwaggerSchema,
  })
  addReaction(
    @Req() request,
    @Param('productId', new JoiValidationPipe(idSchema)) productId: string,
    @Body(new JoiValidationPipe(reactionSchema))
    body: { reaction: AvailableReactions },
  ) {
    return this.productService.addReaction(
      request.user.userId,
      productId,
      body.reaction,
    );
  }

  @Post('/:productId/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: reviewSwaggerSchema,
  })
  addReview(
    @Req() req,
    @Param('productId', new JoiValidationPipe(idSchema)) productId: string,
    @Body(new JoiValidationPipe(reviewSchema)) review: Omit<Review, 'byUser'>,
  ) {
    return this.productService.addReview(req.user.userId, productId, review);
  }

  @Patch('/:productId/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User)
  @ApiBody({
    schema: updateProductSwaggerSchema,
  })
  updateProduct(
    @Req() req,
    @Param('productId', new JoiValidationPipe(idSchema)) productId: string,
    @Body(new JoiValidationPipe(updateProductSchema))
    productUpdatePayload: Partial<Product>,
  ) {
    return this.productService.update(
      req.user.userId,
      productId,
      productUpdatePayload,
    );
  }
}
