import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((value) => {
                if (Array.isArray(value)) {
                    const request = context.switchToHttp().getRequest();
                    const page = parseInt(request.query.page ?? '1', 10);
                    const limit = parseInt(request.query.limit ?? '10', 10);
                    const total = value.length;
                    const start = (page - 1) * limit;
                    const end = start + limit;

                    return {
                        data: value.slice(start, end),
                        meta: {
                            total,
                            page,
                            limit,
                            totalPages: Math.ceil(total / limit),
                        },
                    };
                }
                return value;
            }),
        );
    }
}