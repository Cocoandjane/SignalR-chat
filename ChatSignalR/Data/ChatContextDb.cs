using System.Collections.Generic;
using ChatSignalR.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Reflection.Emit;

class ChatContextDb : DbContext
{
    public ChatContextDb(DbContextOptions<ChatContextDb> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // builder.Entity<RoomUser>()
        //    .HasOne(ru => ru.users)
        //    .WithMany(u => u.roomUsers)
        //    .HasForeignKey("user_id");

        // builder.Entity<RoomUser>()
        //   .HasOne(ru => ru.rooms)
        //   .WithMany(u => u.roomUsers)
        //   .HasForeignKey("room_id");

        // builder.Entity<Message>()
        //   .HasOne(m => m.roomUsers)
        //   .WithMany(ru => ru.messages)
        //   .HasForeignKey("user_id");

        // make user name unique    
        builder.Entity<User>()
            .HasIndex(u => u.name)
            .IsUnique();

        builder.Entity<User>().ToTable("user");
        builder.Entity<Room>().ToTable("room");
        builder.Entity<RoomUser>().ToTable("room_user");
        builder.Entity<Message>().ToTable("message");

    }
    public DbSet<User> users { get; set; }
    public DbSet<Room> rooms { get; set; }
    public DbSet<RoomUser> roomUsers { get; set; }
    public DbSet<Message> messages { get; set; }

    

}