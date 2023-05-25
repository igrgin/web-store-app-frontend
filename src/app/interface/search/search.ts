
export interface Search
{
  name?:string,
  category:string,
  subcategory?:string,
  brands?:string[],
  priceRange?:number[] | undefined,
  page?:number,
  size?:number
}
