using DentoGrand.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DentoGrand.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Appointment>(e =>
        {
            e.ToTable("appointments");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(100);
            e.Property(x => x.Phone).IsRequired().HasMaxLength(30);
            e.Property(x => x.Comment).HasMaxLength(1000);
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");
            e.Property(x => x.IsRegistered).HasDefaultValue(false);
            e.HasIndex(x => x.CreatedAt);
        });

        b.Entity<Promotion>(e =>
        {
            e.ToTable("promotions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).IsRequired().HasMaxLength(3000);
            e.Property(x => x.ImageUrl).HasMaxLength(500);
            e.HasIndex(x => new { x.StartDate, x.EndDate });
        });

        b.Entity<AdminUser>(e =>
        {
            e.ToTable("admin_users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Login).IsRequired().HasMaxLength(100);
            e.HasIndex(x => x.Login).IsUnique();
            e.Property(x => x.PasswordHash).IsRequired();
        });
    }
}
