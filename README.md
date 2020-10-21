probobility

npx sequelize-cli model:generate --name probability --attributes chance:float
npx sequelize-cli model:generate --name prize --attributes name:char,imgURI:string,probabilityId:integer


npx sequelize-cli seed:generate --name default




錯誤處理應該可以統一用一個 middles ware 這樣，再看看。