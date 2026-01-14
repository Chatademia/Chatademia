using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class Changed_column_name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Chats");

            migrationBuilder.AddColumn<string>(
                name: "ClassType",
                table: "Chats",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassType",
                table: "Chats");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Chats",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
