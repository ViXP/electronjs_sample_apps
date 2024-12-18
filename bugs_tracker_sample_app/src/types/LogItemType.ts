export type LogItemType = {
  _id: number,
  text: string,
  priority: "high" | "low" | "moderate",
  user: string,
  created: string
}
