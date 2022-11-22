export enum PointType {
  point = 0,
  hut,
  parkingLot,
  referencePoint,
  linkedPoint,
  startPoint,
  endPoint,
}

/**
-- only hike points
select from points
join hike_points
where type = 0
1 -> 3 -> 5

-- reference points
select from points
join hike_points
where type IN (1, 2)

select *
from points p, hike_points hp
order by hp.index ASC
*/
