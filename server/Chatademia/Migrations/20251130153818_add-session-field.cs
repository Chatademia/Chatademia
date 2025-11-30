using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chatademia.Migrations
{
    /// <inheritdoc />
    public partial class addsessionfield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermaAccessTokenSecret",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Session",
                table: "Users");
        }
    }
}
