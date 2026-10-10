using DentoGrand.Api.Data;
using DentoGrand.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentoGrand.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AppointmentsController(AppDbContext db) => _db = db;

    /// <summary>Создать запись на приём (без авторизации).</summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        var entity = new Appointment
        {
            Name = dto.Name.Trim(),
            Phone = dto.Phone.Trim(),
            Comment = string.IsNullOrWhiteSpace(dto.Comment) ? null : dto.Comment.Trim(),
            CreatedAt = DateTime.UtcNow,
            IsRegistered = false
        };
        _db.Appointments.Add(entity);
        await _db.SaveChangesAsync();
        return Ok(new { id = entity.Id });
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAll() =>
        await _db.Appointments.AsNoTracking().OrderByDescending(a => a.CreatedAt).ToListAsync();

    [HttpPatch("{id:int}/registered")]
    [Authorize]
    public async Task<IActionResult> SetRegistered(int id, SetRegisteredDto dto)
    {
        var a = await _db.Appointments.FindAsync(id);
        if (a == null) return NotFound();
        a.IsRegistered = dto.IsRegistered;
        await _db.SaveChangesAsync();
        return Ok(a);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var a = await _db.Appointments.FindAsync(id);
        if (a == null) return NotFound();
        _db.Appointments.Remove(a);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
