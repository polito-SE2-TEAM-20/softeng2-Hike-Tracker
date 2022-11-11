import { Injectable } from '@nestjs/common';
import GpxParser from 'gpxparser';

import { GPoint, Hike, Point, PointType } from '@app/common';

type PreparedPoint = Pick<Point, 'type' | 'position'>;
type PreparedHike = {
  points: PreparedPoint[];
  hike: Partial<Hike>;
};

@Injectable()
export class GpxService {
  async parseHikes(gpxData: string): Promise<PreparedHike[]> {
    const parser = new GpxParser();
    parser.parse(gpxData);

    const hikes: PreparedHike[] = [];

    parser.tracks.forEach(
      ({
        name: title = '',
        distance,
        elevation,
        desc: description = '',
        points: routePoints,
      }) => {
        const points = routePoints.map<PreparedPoint>(({ lat, lon }) => {
          const position: GPoint = {
            type: 'Point',
            coordinates: [lon, lat],
          };

          return {
            type: PointType.point,
            position,
          };
        });

        const hike = {
          title: title || '',
          description: description || '',
          expectedTime: 0,
          ascent: elevation.avg,
          distance: distance?.total ?? 0,
        };

        hikes.push({
          points,
          hike,
        });
      },
    );

    return hikes;
  }
}
