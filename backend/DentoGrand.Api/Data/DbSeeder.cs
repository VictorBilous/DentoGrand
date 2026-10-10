using DentoGrand.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace DentoGrand.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration config)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>();

        // Создаёт БД и таблицы при первом запуске.
        // Для эволюции схемы в production лучше перейти на миграции EF Core.
        await db.Database.EnsureCreatedAsync();

        if (!db.AdminUsers.Any())
        {
            var login = config["Admin:Login"] ?? "admin";
            var password = config["Admin:Password"] ?? "Admin12345!";
            var admin = new AdminUser { Login = login };
            admin.PasswordHash = hasher.HashPassword(admin, password);
            db.AdminUsers.Add(admin);
        }

        if (!db.Promotions.Any())
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            db.Promotions.AddRange(
                new Promotion
                {
                    Title = "Бесплатная консультация",
                    Description = "Первичный осмотр и составление плана лечения — бесплатно для новых пациентов.",
                    ImageUrl = "/img/promo-1.svg",
                    StartDate = today.AddDays(-7),
                    EndDate = today.AddDays(60)
                },
                new Promotion
                {
                    Title = "Профессиональная гигиена со скидкой 20%",
                    Description = "Ультразвуковая чистка и Air Flow со скидкой 20% при записи через сайт.",
                    ImageUrl = "/img/promo-2.svg",
                    StartDate = today.AddDays(-1),
                    EndDate = today.AddDays(30)
                },
                new Promotion
                {
                    Title = "Отбеливание: скоро в продаже",
                    Description = "Эта акция начнётся позже и пока не отображается на странице «Акции».",
                    ImageUrl = "/img/promo-3.svg",
                    StartDate = today.AddDays(45),
                    EndDate = today.AddDays(75)
                });
        }

        await db.SaveChangesAsync();
    }
}
