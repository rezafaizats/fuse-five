declare module "*.json" {
  const content: any;
  export default content;
}

declare module "*.html" {
  const content: string;
  export default content;
}