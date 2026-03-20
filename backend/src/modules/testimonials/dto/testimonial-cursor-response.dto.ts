import { ApiProperty } from '@nestjs/swagger';
import { Testimonial } from '../entity/testimonial.entity';

export class TestimonialCursorResponseDto {
  @ApiProperty({ type: [Testimonial] })
  data: Testimonial[];

  @ApiProperty({
    nullable: true,
    description:
      'ISO timestamp to pass as cursor for next page. Null if no more items.',
  })
  nextCursor: string | null;

  @ApiProperty()
  hasMore: boolean;
}
