using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class user_table_shortname_ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Color",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ShortName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShortName",
                table: "Users");
        }
    }
}
