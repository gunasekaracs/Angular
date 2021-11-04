using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class UserTableUpdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photoes_Users_AppUserId",
                table: "Photoes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Photoes",
                table: "Photoes");

            migrationBuilder.RenameTable(
                name: "Photoes",
                newName: "Photos");

            migrationBuilder.RenameIndex(
                name: "IX_Photoes_AppUserId",
                table: "Photos",
                newName: "IX_Photos_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Photos",
                table: "Photos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Photos",
                table: "Photos");

            migrationBuilder.RenameTable(
                name: "Photos",
                newName: "Photoes");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_AppUserId",
                table: "Photoes",
                newName: "IX_Photoes_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Photoes",
                table: "Photoes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Photoes_Users_AppUserId",
                table: "Photoes",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
