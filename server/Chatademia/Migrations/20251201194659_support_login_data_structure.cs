using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class support_login_data_structure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OAuthToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OAuthTokenSecret",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PermaAccessToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PermaAccessTokenSecret",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Session",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "UserTokensId",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "TempUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OAuthToken = table.Column<string>(type: "text", nullable: true),
                    OAuthTokenSecret = table.Column<string>(type: "text", nullable: true),
                    PermaAccessToken = table.Column<string>(type: "text", nullable: true),
                    PermaAccessTokenSecret = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TempUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PermaAccessToken = table.Column<string>(type: "text", nullable: true),
                    PermaAccessTokenSecret = table.Column<string>(type: "text", nullable: true),
                    Session = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserTokensId",
                table: "Users",
                column: "UserTokensId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserTokens_UserTokensId",
                table: "Users",
                column: "UserTokensId",
                principalTable: "UserTokens",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserTokens_UserTokensId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "TempUsers");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserTokensId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserTokensId",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "OAuthToken",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OAuthTokenSecret",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PermaAccessToken",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PermaAccessTokenSecret",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "Session",
                table: "Users",
                type: "uuid",
                nullable: true);
        }
    }
}
