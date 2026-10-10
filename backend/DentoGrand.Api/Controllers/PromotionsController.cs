using DentoGrand.Api.Data;
using DentoGrand.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentoGrand.Api.Controllers;

[ApiController]
[Route("api/promotions")]
public class PromotionsController : ControllerBase
{
    private static readonly string[] AllowedExt = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private const long MaxImageBytes = 5 * 1024 * 1024;

    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public PromotionsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    /// <summary>Актуальные акции: сегодняшняя дата попадает в интервал [StartDate; EndDate].</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Promotion>>> GetActive()
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        return await _db.Promotions.AsNoTracking()
            .Where(p => p.StartDate <= today && p.EndDate >= today)
            .OrderBy(p => p.EndDate)
            .ToListAsync();
    }

    /// <summary>Все акции (для администратора).</summary>
    [HttpGet("all")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Promotion>>> GetAll() =>
        await _db.Promotions.AsNoTracking().OrderByDescending(p => p.StartDate).ToListAsync();

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Promotion>> Create(PromotionDto dto)
    {
        var p = new Promotion();
        Apply(p, dto);
        _db.Promotions.Add(p);
        await _db.SaveChangesAsync();
        return Ok(p);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<Promotion>> Update(int id, PromotionDto dto)
    {
        var p = await _db.Promotions.FindAsync(id);
        if (p == null) return NotFound();
        Apply(p, dto);
        await _db.SaveChangesAsync();
        return Ok(p);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.Promotions.FindAsync(id);
        if (p == null) return NotFound();
        _db.Promotions.Remove(p);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Загрузка изображения акции. Возвращает публичный URL.</summary>
    [HttpPost("image")]
    [Authorize]
    [RequestSizeLimit(MaxImageBytes + 1024 * 64)]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Файл не выбран" });
        if (file.Length > MaxImageBytes)
            return BadRequest(new { message = "Размер файла не должен превышать 5 МБ" });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExt.Contains(ext))
            return BadRequest(new { message = "Допустимые форматы: JPG, PNG, WEBP, GIF" });

        var dir = Path.Combine(_env.ContentRootPath, "uploads");
        Directory.CreateDirectory(dir);
        var name = $"{Guid.NewGuid():N}{ext}";
        await using (var stream = System.IO.File.Create(Path.Combine(dir, name)))
            await file.CopyToAsync(stream);

        return Ok(new { url = $"/uploads/{name}" });
    }

    private static void Apply(Promotion p, PromotionDto dto)
    {
        p.Title = dto.Title.Trim();
        p.Description = dto.Description.Trim();
        p.ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? null : dto.ImageUrl.Trim();
        p.StartDate = dto.StartDate;
        p.EndDate = dto.EndDate;
    }
}
