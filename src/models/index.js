import
User
from "./user";
import Card from "./card"
import Column from "./column"

User.hasMany(Card, {
    foreignKey: 'createBy',
    as: "cards"
});
User.hasMany(Column, {
    foreignKey: 'createColumnBy',
    as: "columns"
});
Card.belongsTo(User, {
    foreignKey: 'createBy',
    as: "user_info",
});
Card.belongsTo(Column, {
    foreignKey: 'idColumn',
    as: "column_info"
});

Column.hasMany(Card, {
    foreignKey: 'idColumn',
    as: "cards"
});
Column.belongsTo(User, {
    foreignKey: 'createColumnBy',
    as: "user_info",
});

export {
    Column,
    User,
    Card,
}