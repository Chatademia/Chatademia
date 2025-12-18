using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class add_filename_history : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "oldFileName",
                table: "Messages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "oldFileName",
                table: "Messages");
        }
    }
}
