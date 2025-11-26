using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class add_oauth_token_fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "OAuthTokenSecret");

            migrationBuilder.AddColumn<string>(
                name: "OAuthToken",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OAuthToken",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "OAuthTokenSecret",
                table: "Users",
                newName: "Username");
        }
    }
}
