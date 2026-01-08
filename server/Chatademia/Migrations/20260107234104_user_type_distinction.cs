using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class user_type_distinction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsUsosAccount",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUsosAccount",
                table: "Users");
        }
    }
}
